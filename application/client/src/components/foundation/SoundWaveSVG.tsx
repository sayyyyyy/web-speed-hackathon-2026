import { useEffect, useRef, useState } from "react";

interface ParsedData {
  max: number;
  peaks: number[];
}

let sharedAudioCtx: AudioContext | null = null;
function getAudioContext() {
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioContext();
  }
  return sharedAudioCtx;
}

async function calculate(data: ArrayBuffer): Promise<ParsedData> {
  const audioCtx = getAudioContext();

  // 音声をデコードする (元のデータを壊さないように slice する)
  const buffer = await audioCtx.decodeAudioData(data.slice(0));
  
  const leftChannel = buffer.getChannelData(0);
  const rightChannel = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : leftChannel;
  const length = buffer.length;

  const numPeaks = 100;
  const chunkSize = Math.floor(length / numPeaks);
  const peaks = new Array(numPeaks).fill(0);
  let max = 0;

  for (let i = 0; i < numPeaks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, length);
    let sum = 0;
    for (let j = start; j < end; j++) {
      const left = leftChannel[j] ?? 0;
      const right = rightChannel[j] ?? 0;
      // 左右チャンネルの平均の絶対値を加算
      sum += (Math.abs(left) + Math.abs(right)) / 2;
    }
    const avg = sum / (end - start || 1);
    peaks[i] = avg;
    if (avg > max) max = avg;
  }

  return { max, peaks };
}

interface Props {
  soundData: ArrayBuffer;
}

/**
 * 音声の波形を表示するコンポーネント
 */
export const SoundWaveSVG = ({ soundData }: Props) => {
  const uniqueId = useRef(Math.random().toString(16)).current;
  const [{ max, peaks }, setPeaks] = useState<ParsedData>({
    max: 0,
    peaks: [],
  });

  useEffect(() => {
    let isCancelled = false;
    calculate(soundData).then((result) => {
      if (!isCancelled) {
        setPeaks(result);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [soundData]);

  return (
    <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 1">
      {peaks.map((peak, idx) => {
        const ratio = max > 0 ? peak / max : 0;
        return (
          <rect
            key={`${uniqueId}#${idx}`}
            fill="var(--color-cax-accent)"
            height={ratio}
            width="1"
            x={idx}
            y={1 - ratio}
          />
        );
      })}
    </svg>
  );
};
