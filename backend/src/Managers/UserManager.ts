import { Socket } from 'socket.io';
import { QuizManager } from './QuizManager';

const ADMIN_PASSWORD = 'ADMIN_PASSWORD';
export class UserManager {
    private users: {
        roomId: string;
        socket: Socket;
    }[];
    private quizmanager: QuizManager;

    constructor() {
        this.users = [];
        this.quizmanager = new QuizManager();
    }

    public addUser(roomId: string, socket: Socket) {
        //socketId -> randomly generated
        this.users.push({
            roomId,
            socket,
        });
        this.createHandlers(roomId, socket);
    }

    private createHandlers(roomId: string, socket: Socket) {
        socket.on('join', (data) => {
            const userId = this.quizmanager.addUser(data.roomId, data.name);
            socket.emit('init', {
                userId,
                state: this.quizmanager.getCurrentState(roomId), //for a user joining in between
            });
        });
        socket.on('joinAdmin', (data) => {
            const userId = this.quizmanager.addUser(data.roomId, data.name);
            if (data.password !== ADMIN_PASSWORD) {
                return;
            }

            socket.emit('adminInit', {
                userId,
                state: this.quizmanager.getCurrentState(roomId), //for a user joining in between
            });

            socket.on('createQuiz', (data) => {
                this.quizmanager.addQuiz(data.roomId);
            });

            socket.on('createProblem', (data) => {
                this.quizmanager.addProblem(data.roomId, data.problem);
            });

            socket.on('next', (data) => {
                this.quizmanager.next(data.roomId);
            });
        });

        socket.on('submit', (data) => {
            const userId = data.userId;
            const roomId = data.roomId;
            const problemId = data.problemId;
            const submission = data.submission;

            if (
                submission != 0 &&
                submission != 1 &&
                submission != 2 &&
                submission != 3
            ) {
                console.error('issue while getting input ' + submission);
                return;
            }

            this.quizmanager.submit(userId, roomId, problemId, submission);
        });
    }
}
