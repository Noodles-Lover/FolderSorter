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

async function openFolder(folderHandle, isRecursion, ignoreOtherFile) {
	let folderFiles = []

	for await (const fileHandle of folderHandle.values()) {
		// 用fileHandle遍历文件夹内的文件（FileSystemFileHandle类）
		console.log(`Entry name: ${fileHandle.name}, Entry kind: ${fileHandle.kind}`);

		if (fileHandle.kind === 'file') { // 处理文件
			const file = await fileHandle.getFile();

			if (ignoreOtherFile) {
				// 如果不是三种媒体文件，直接返回
				if (!(file.type.startsWith('image') || file.type.startsWith('audio') || file.type.startsWith(
						'video') || file.type.endsWith('.mov'))) continue
			}

			getMediaDuration(file).then(duration => {
				folderFiles.push({
					fileHandle: fileHandle,
					name: file.name,
					size: formatFileSize(file.size),
					length: formatDuration(duration),
					lastModified: new Date(file.lastModified)
						.toLocaleString()
				})
				// console.log('媒体长度为：', duration, '秒');
			}).catch(error => {
				// this.$Message.error('获取媒体长度失败');
				console.error('获取媒体长度失败:', error);
			});

		} else if (fileHandle.kind === 'directory') {	// 子目录
			if (fileHandle.name == "_删除") continue		// 网站创建的"_删除"文件夹
			
			if (isRecursion) {	// 递归文件夹
				let subFiles = await openFolder(fileHandle, true, ignoreOtherFile)
				folderFiles = folderFiles.concat(subFiles)
			}
		}
	}
	return folderFiles
}

// function getSumSize(folderHandle){

// }