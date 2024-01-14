import { Socket } from 'socket.io-client';

export const QuizControls = (props: {
    socket: Socket | null;
    roomId: string;
}) => {
    return (
        <div>
            Quiz Controls
            <br />
            <button
                onClick={() => {
                    props.socket?.emit('start', { roomId: props.roomId });
                }}
            >
                Start Quiz
            </button>
            <button
                onClick={() => {
                    props.socket?.emit('next', { roomId: props.roomId });
                }}
            >
                Next Problem
            </button>
        </div>
    );
};
