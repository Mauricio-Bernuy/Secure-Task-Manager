import axios from "axios";

const userServiceFactory = () => {
	function login(email, password) {
		return axios.post(`/api/auth`, { email, password });
	}
	function _2FA(email, _2FA) {
		return axios.post(`/api/2FA`, { email, _2FA });
	}
	
	function register(first_name, last_name, email, password, is_admin) {
		return axios.post(`/api/enroll`, {
			first_name,
			last_name,
			email,
			password,
			is_admin
		});
	}
	
	function getTasks(email) {
		return axios.get(`/api/getUserTasks`, {
			email
		});
	}

	function markTaskDone(task_id) {
		console.log(task_id);
		return axios.post(`/api/markTaskComplete`, {
			task_id
		});
	}

	function mockTask(email) {
		console.log(email);
		return axios.post(`/api/mockTask4User`, {
			email
		});
	}

	return { login, _2FA, register, getTasks, markTaskDone, mockTask };
};

module.exports = {
	userServiceFactory,
};
