import { IoManager } from './Managers/IoManager';
import { UserManager } from './Managers/UserManager';

const io = IoManager.getIo();
const usermanager = new UserManager();

io.on('connection', socket => {
    console.log('to delete 3 _ from index.ts');

    usermanager.addUser(socket);

    socket.on('disconnect', reason => {
        console.log("disconnected due to: ", reason);
    });

})

io.listen(3000)