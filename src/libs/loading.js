import { Loading, QSpinnerGears,QSpinnerHourglass } from 'quasar'

let loading = {
}
let lastRequest = new Date('2018');

loading.show = function (config) {
    if (config&&config.loading) {
        let now = new Date();
        let ms = now - lastRequest;
        lastRequest = now;
        if (ms > 2000) {//相隔两秒的请求才重新显示loading
            if (config.loading == "gears") {
                Loading.show({
                    spinner: QSpinnerGears,
                    message: '',
                    messageColor: 'white',
                    spinnerSize: 100,
                    spinnerColor: 'white',
                    customClass : ''
                })
            }else if(config.loading=="hourglass")
            {
                Loading.show({
                   // spinner: QSpinnerHourglass,
                    message: '',
                    messageColor: 'white',
                    spinnerSize: 100,
                    spinnerColor: 'white',
                    customClass : ''
                })
            }
        }
    }

}

loading.hide = function (config) {
    if (config&&config.loading) {
        setTimeout(() => {
            Loading.hide()
        }, 1000)
    }
}

export default loading;
