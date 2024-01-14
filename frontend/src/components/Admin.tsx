import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { CreateProblem } from './CreateProblem';
import { QuizControls } from './QuizControls';

export const Admin = () => {
    const [socket, setSocket] = useState<null | Socket>(null);
    const [quizId, setQuizId] = useState<string>('');
    const [roomId, setRoomId] = useState<string>('');

    useEffect(() => {
        const socket = io('http://localhost:3000');
        setSocket(socket);

        socket.on('connect', () => {
            console.log("connected socketId: ", socket.id);
            socket.emit('joinAdmin', {
                password: 'ADMIN_PASSWORD',
            });
        });

    }, []);

    if (!quizId) {
        return (
            <div>
                <input
                    type="text"
                    onChange={(e) => {
                        console.log(e.target.value , socket?.id);
                        setRoomId(e.target.value);
                    }}
                    placeholder="Enter room Id"
                />
                <br />
                <button
                    onClick={() => {
                        console.log('clicked from frontend');
                        if(socket){
                            console.log("should work")
                            socket.emit('createQuiz', {roomId: roomId});
                        }
                        setQuizId(roomId);
                    }}
                >
                    Create Room
                </button>
            </div>
        );
    }
    return (
        <div>
            <CreateProblem roomId={roomId} socket={socket} />
            <br />
            <QuizControls roomId={roomId} socket={socket} />
        </div>
    ); 
};
