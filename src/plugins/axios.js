export default function axios({ $axios, redirect }) {
  $axios.onRequest(config => {
    console.log(`[${new Date()}] Making request to ${config.url}`);
  });
  $axios.onError(error => {
    const code = +(error.response && error.response.status);
    if (code === 400) {
      redirect('/400');
    }
  });
}
