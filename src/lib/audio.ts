export async function extractMonoAudio(file: File) {
  // Convert file to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Decode audio from the video
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Combine channels into mono
  const channelData = audioBuffer.getChannelData(0); // left channel
  if (audioBuffer.numberOfChannels > 1) {
    const rightData = audioBuffer.getChannelData(1);
    for (let i = 0; i < channelData.length; i++) {
      channelData[i] = (channelData[i] + rightData[i]) / 2;
    }
  }

  // Create a new AudioBuffer with mono data
  const monoBuffer = audioContext.createBuffer(
    1,
    channelData.length,
    audioBuffer.sampleRate
  );
  monoBuffer.copyToChannel(channelData, 0);

  // Encode to WAV
  const wavBlob = audioBufferToWav(monoBuffer);
  return wavBlob;
}

// Helper to encode AudioBuffer to WAV
function audioBufferToWav(buffer: AudioBuffer) {
  const numOfChan = buffer.numberOfChannels,
    length = buffer.length * numOfChan * 2 + 44,
    bufferArray = new ArrayBuffer(length),
    view = new DataView(bufferArray),
    channels = [];
  let pos = 0;

  function writeString(
    view: DataView<ArrayBuffer>,
    offset: number,
    string: string
  ) {
    for (let i = 0; i < string.length; i++)
      view.setUint8(offset + i, string.charCodeAt(i));
  }

  // write WAV header
  writeString(view, pos, "RIFF");
  pos += 4;
  view.setUint32(pos, length - 8, true);
  pos += 4;
  writeString(view, pos, "WAVE");
  pos += 4;
  writeString(view, pos, "fmt ");
  pos += 4;
  view.setUint32(pos, 16, true);
  pos += 4;
  view.setUint16(pos, 1, true);
  pos += 2;
  view.setUint16(pos, numOfChan, true);
  pos += 2;
  view.setUint32(pos, buffer.sampleRate, true);
  pos += 4;
  view.setUint32(pos, buffer.sampleRate * 2 * numOfChan, true);
  pos += 4;
  view.setUint16(pos, numOfChan * 2, true);
  pos += 2;
  view.setUint16(pos, 16, true);
  pos += 2;
  writeString(view, pos, "data");
  pos += 4;
  view.setUint32(pos, length - pos - 4, true);
  pos += 4;

  // write interleaved data
  for (let i = 0; i < buffer.numberOfChannels; i++)
    channels.push(buffer.getChannelData(i));
  for (let i = 0; i < buffer.length; i++)
    for (let j = 0; j < numOfChan; j++) {
      const sample = Math.max(-1, Math.min(1, channels[j][i]));
      view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      pos += 2;
    }

  return new Blob([view], { type: "audio/wav" });
}
