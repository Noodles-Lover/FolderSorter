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
	let folderFiles = []	// 最终返回
	let promises = []; 		// 收集所有异步Promise
	let fileHandles = []; 	// 收集所有文件句柄
	let dirHandles = []; 	// 收集所有目录句柄

	// 先收集所有的句柄，避免for await阻塞
	for await (const fileHandle of folderHandle.values()) {
		if (fileHandle.kind === 'file') {
			fileHandles.push(fileHandle);
		} else if (fileHandle.kind === 'directory') {
			if (fileHandle.name == "_删除") continue;
			dirHandles.push(fileHandle);
		}
	}

	// 分批处理文件，每批10个，避免阻塞主线程
	for (let i = 0; i < fileHandles.length; i++) {
		const fileHandle = fileHandles[i];
		const file = await fileHandle.getFile();

		if (ignoreOtherFile) {
			if (!(file.type.startsWith('image') || file.type.startsWith('audio') || file.type.startsWith(
				'video') || file.name.endsWith('.mov'))) continue;
		}

		// 收集Promise
		const promise = getMediaDuration(file).then(duration => {
			folderFiles.push({
				fileHandle: fileHandle,
				name: file.name,
				size: formatFileSize(file.size),
				length: formatDuration(duration),
				lastModified: new Date(file.lastModified).toLocaleString()
			});
		}).catch(error => {
			console.error('获取媒体长度失败:', error);
		});

		promises.push(promise);
	}

	
	// 处理子目录（递归）
	if (isRecursion) {
		for (const dirHandle of dirHandles) {
			let subFiles = await openFolder(dirHandle, true, ignoreOtherFile);
			folderFiles = folderFiles.concat(subFiles);
		}
	}

	// 等待所有Promise完成，确保folderFiles完整
	await Promise.all(promises);

	return folderFiles
}

// function getSumSize(folderHandle){
// }
