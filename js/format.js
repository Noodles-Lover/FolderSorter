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

function formatFileSize(size) {
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	let i = 0;
	while (size >= 1024 && i < units.length - 1) {
		size /= 1024;
		i++;
	}
	return `${size.toFixed(2)} ${units[i]}`;
}