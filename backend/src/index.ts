import { IoManager } from './Managers/IoManager';

const io = IoManager.getIo();

io.on('connection', client => {
    client.on('event', data => {
        const type = data.type;
    });
    client.on('disconnect', reason => {
        console.log(reason);
    });

})

io.listen(3000)