async function getMediaDuration(file) {
	// 如果不是音频或视频文件，return
	if (!(file.type.startsWith('video') || file.type.startsWith('audio') || file.name.endsWith('.mov')))
		return new Promise((resolve, reject) => {
			resolve(-1);
		})

	return new Promise((resolve, reject) => {
		// 创建一个临时的 URL
		const url = URL.createObjectURL(file);

		// 创建一个 audio 或 video 元素
		const mediaElement = document.createElement(file.type === 'audio' ? 'audio' :
			'video');
		mediaElement.src = url;

		// 监听 metadata 加载完成事件
		mediaElement.addEventListener('loadedmetadata', () => {
			const duration = mediaElement.duration.toFixed(2);
			// console.log(`媒体长度为：${duration} 秒`);
			resolve(duration);
			URL.revokeObjectURL(url); // 使用完毕后释放 URL
		});

		mediaElement.addEventListener('error', () => {
			console.error('媒体文件加载失败');
			reject(new Error('媒体文件加载失败'));
			URL.revokeObjectURL(url); // 使用完毕后释放 URL
		});
	});
}

async function verifyPermission(fileHandle) {
	const options = {};
	options.mode = 'readwrite';
	
	// Check if permission was already granted. If so, return true.
	if ((await fileHandle.queryPermission(options)) === 'granted') {
		return true;
	}
	// Request permission. If the user grants permission, return true.
	if ((await fileHandle.requestPermission(options)) === 'granted') {
		return true;
	}
	// The user didn't grant permission, so return false.
	return false;
}