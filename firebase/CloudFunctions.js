// const functions = require('firebase-functions');
const axios = require('axios').default;

async function getClasses(quarter) {
	return axios.get(`https://api.ucsb.edu/academics/curriculums/v1/classes/search?quarter=${quarter}&pageNumber=1&pageSize=20&includeClassSections=true`, {

		},{
		    headers: {
			"Content-Type":"application/json",

		    }
		});
    }

// new Vue({
// 	el: '#app',
// 	data () {
// 	  return {
// 	    info: null,
// 	    loading: true,
// 	    errored: false
// 	  }
// 	},
// 	filters: {
// 	  currencydecimal (value) {
// 	    return value.toFixed(2)
// 	  }
// 	},
// 	mounted () {
// 	  axios
// 	    .get('https://api.coindesk.com/v1/bpi/currentprice.json')
// 	    .then(response => {
// 	      this.info = response.data.bpi
// 	    })
// 	    .catch(error => {
// 	      console.log(error)
// 	      this.errored = true
// 	    })
// 	    .finally(() => this.loading = false)
// 	}
//       })
    
//     try {
// 	const response = await postRequest(sentence);
//     } catch (error) {
// 	console.log(error);
//     }
   
    

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

	