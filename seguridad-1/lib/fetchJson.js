export default async function fetchJson(...args) {
    console.log("fetching data")
	try {
		const response = await fetch(...args);
		const data = await response.json();

		if (response.ok) {
			return data;
		}

		const error = new Error(response.statusText);
		error.response = response;
		error.data = data;
		throw error;
	} catch (error) {
        console.log("catched error")
        
		if (!error.data) {
			error.data = { message: error.message };
		}
        throw error;
	}
}
