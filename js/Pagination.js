/**
 * 分页处理类
 * 负责管理文件列表的分页逻辑
 */
class Pagination {
	/**
	 * 构造函数
	 * @param {number} pageSize - 每页显示的文件数量，默认50
	 */
	constructor(pageSize = 50) {
		this.allItems = []; // 所有文件
		this.currentPage = 1; // 当前页码
		this.pageSize = pageSize; // 每页数量
	}

	/**
	 * 设置所有文件
	 * @param {Array} items - 文件数组
	 */
	setItems(items) {
		this.allItems = items;
		this.currentPage = 1; // 重置到第一页
	}

	/**
	 * 获取当前页的文件
	 * @returns {Array} 当前页的文件数组
	 */
	getCurrentPageItems() {
		const startIndex = (this.currentPage - 1) * this.pageSize;
		const endIndex = startIndex + this.pageSize;
		return this.allItems.slice(startIndex, endIndex);
	}

	/**
	 * 获取总页数
	 * @returns {number} 总页数
	 */
	getTotalPages() {
		return Math.ceil(this.allItems.length / this.pageSize);
	}

	/**
	 * 跳转到指定页
	 * @param {number} page - 目标页码
	 * @returns {boolean} 是否跳转成功
	 */
	gotoPage(page) {
		if (page >= 1 && page <= this.getTotalPages()) {
			this.currentPage = page;
			return true;
		}
		return false;
	}

	/**
	 * 跳转到下一页
	 * @returns {boolean} 是否跳转成功
	 */
	nextPage() {
		return this.gotoPage(this.currentPage + 1);
	}

	/**
	 * 跳转到上一页
	 * @returns {boolean} 是否跳转成功
	 */
	prevPage() {
		return this.gotoPage(this.currentPage - 1);
	}

	/**
	 * 获取分页信息
	 * @returns {Object} 分页信息对象
	 */
	getPaginationInfo() {
		return {
			currentPage: this.currentPage,
			pageSize: this.pageSize,
			totalItems: this.allItems.length,
			totalPages: this.getTotalPages(),
			hasNext: this.currentPage < this.getTotalPages(),
			hasPrev: this.currentPage > 1
		};
	}
}
