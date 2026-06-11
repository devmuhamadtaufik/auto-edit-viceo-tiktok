import ffmpeg from 'fluent-ffmpeg';

export function processVideo(inputPath: string, outputPath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		ffmpeg(inputPath)
			.output(outputPath)
			.outputOptions(['-preset', 'ultrafast', '-movflags', '+faststart'])
			.on('end', resolve)
			.on('error', reject)
			.run();
	});
}

export function generateThumbnail(inputPath: string, outputPath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		ffmpeg(inputPath)
			.screenshots({
				count: 1,
				filename: outputPath,
				size: '320x180'
			})
			.on('end', resolve)
			.on('error', reject);
	});
}
