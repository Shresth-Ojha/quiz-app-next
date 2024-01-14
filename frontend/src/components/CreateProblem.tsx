import { useState } from 'react';
import { Socket } from 'socket.io-client';

export const CreateProblem = (props: {
    roomId: string;
    socket: Socket | null;
}) => {
    const [title, setTitle] = useState<string>('');
    const [answer, setAnswer] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [options, setOptions] = useState<
        {
            title: string;
            id: number;
        }[]
    >([
        {
            title: '',
            id: 0,
        },
        {
            title: '',
            id: 1,
        },
        {
            title: '',
            id: 2,
        },
        {
            title: '',
            id: 3,
        },
    ]);
    const [image, setImage] = useState<string>('');
    return (
        <div>
            Create problem
            <br />
            <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter problem title"
            />
            <br />
            <input
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter problem description"
            />
            <br />
            <br />
            {[0, 1, 2, 3].map((optionId) => (
                <div>
                    <input
                        type="radio"
                        onChange={() => {
                            console.log(answer);
                            setAnswer(optionId);
                            console.log(answer);
                        }}
                        checked={optionId === answer}
                        // name='answer'
                    />
                    <input
                        type="text"
                        onChange={(e) =>
                            setOptions((options) =>
                                options.map((x) => {
                                    if (x.id === optionId) {
                                        return {
                                            ...x,
                                            title: e.target.value,
                                        };
                                    }
                                    return x;
                                })
                            )
                        }
                        placeholder={`Enter option ${optionId}`}
                    />
                </div>
            ))}
            <button
                onClick={() => {
                    console.log('adding problem from frontend');
                    props.socket?.emit('createProblem', {
                        roomId: props.roomId,
                        problem: {
                            title,
                            description,
                            answer,
                            options,
                        },
                    });
                    console.log('added problem from frontend');
                }}
            >
                Create problem
            </button>
        </div>
    );
};
