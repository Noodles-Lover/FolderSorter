function formatDuration(seconds) {
	if (seconds === -1) {
		return '--';
	}
	if (seconds < 30) {
		return seconds + "秒";
	}

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secondsRemaining = Math.floor(seconds % 60);

	// 使用 padStart 确保每部分至少有两位数字
	const formattedHours = String(hours).padStart(2, '0');
	const formattedMinutes = String(minutes).padStart(2, '0');
	const formattedSeconds = String(secondsRemaining).padStart(2, '0');

	return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

function formatFileSize(size) {
	let i = 0;
	while (size >= 1024 && i < units.length - 1) {
		size /= 1024;
		i++;
	}
	return `${size.toFixed(2)} ${units[i]}`;
}

// 带单位的文件大小 还原为纯数字
function parseFileSize(fileSizeStr) {
	const [sizeStr, unit] = fileSizeStr.split(' ');
	const size = parseFloat(sizeStr);
	const unitIndex = units.indexOf(unit);
	let originalSize = size;

	for (let i = unitIndex; i > 0; i--) {
		originalSize *= 1024;
	}

	return originalSize;
}

// 时长 还原为纯数字
function parseDuration(durationStr) {
    if (durationStr === '--') {
        return -1; // 特殊值 -1
    }

    // 检查是否以 "秒" 结尾
    if (durationStr.endsWith('秒')) {
        return parseInt(durationStr, 10); // 直接解析为整数
    }

    // 分割小时、分钟和秒
    const [hours, minutes, seconds] = durationStr.split(':').map(Number);

    // 计算总秒数
    return hours * 3600 + minutes * 60 + seconds;
}