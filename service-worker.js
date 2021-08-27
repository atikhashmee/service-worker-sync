const cacheName = 'v1'

const cacheAssets = [
    'index.html',
    'about.html', 
    'style.css',
    'main.js'
]


// call install event 

self.addEventListener('install', e=>{
    e.waitUntil(
        caches.open(cacheName)
        .then(cache=>{
            cache.addAll(cacheAssets)
        })
        .then(()=>self.skipWaiting())
    )
})


// call an activate event
self.addEventListener('activate', (e)=>{
    //remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache=>{
                    if (cache !== cacheName) {
                        return caches.delete(cache)
                    }
                })
            )
        })
    )

})


//call fetch event
self.addEventListener('fetch', e=> {
    e.respondWith(
        fetch(e.request)
        .catch(()=>caches.match(e.request))
    )
})

self.addEventListener('sync', event => {
    console.log(event, 'sync events');
    if (event.tag =='sync-messages') {
       event.waitUntil('syncMessages');
    }
 })

 class MessagesService {
    async createMessages(messages) {
        return fetch('https://api/messages', {
          method: 'POST',
          body: JSON.stringify({
              content: messages.content,
              author_id: messages.author_id
          }),
          headers: {
              'Content-Types': 'application/json'
          }
        }).catch(error => {
            this.saveMessagesInOffline(messages);
            throw error;
        });
    }

    async saveMessagesInOffline(messages) {
        const db = await openDB('messages', 1, {
            upgrade(db) {
                db.createObjectStore('messageToSync', { keyPath: 'id' });
            }
        });
        const tx = db.transaction('messagesToSync', 'readwrite');
        tx.store.put({...messages});
        await tx.done;
    }

}