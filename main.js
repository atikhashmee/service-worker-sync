if ('serviceWorker' in navigator) {
    window.addEventListener('load', () =>{
        navigator.serviceWorker
        .register('./service-worker.js')
        .then(()=>navigator.serviceWorker.ready)
        .then(reg=>{
            console.log('registered', reg);
            if ('SyncManager' in window) {
                reg.sync.register('sync-messages')
            }
        })
        .catch(err=> console.log(err, 'asdf'))
    })
}
