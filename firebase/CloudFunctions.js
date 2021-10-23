// const functions = require('firebase-functions');
const axios = require('axios').default;

async function postRequest(x) {
	return axios.post('https://api.ucsb.edu/academics/curriculums/v1/classes/search?quarter=20211&pageNumber=10&pageSize=35&includeClassSections=true', {

		},{
		    headers: {
			"Content-Type":"application/json",
			"ucsb-api-key":"e7Ur5HGjiyp11ZkCIe5VXmsEgi3W6P4E"
		    }
		});
    }
    
    try {
	const response = await postRequest(sentence);
    } catch (error) {
	console.log(error);
    }
    
//     console.log(response.data.animated[0].gif.original.url);
//     apiResponse = response.data.animated[0].gif.original.url;
//     await context.sendActivity(apiResponse);
// axios({
// 	method: 'get',
// 	url: 'https://api.ucsb.edu/academics/curriculums/v1/classes/search?quarter=20211&pageNumber=10&pageSize=35&includeClassSections=true',
// 	responseType: 'stream'
//       })
// 	.then(function (response) {
// 	  response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
// 	});

	