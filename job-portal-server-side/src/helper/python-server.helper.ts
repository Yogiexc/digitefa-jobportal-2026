import * as zmq from 'zeromq';

let socket: zmq.Request;
let inited = false;
let isPythonActive = true;

function initSocket() {
  if (inited) return;
  const url = process.env.SOCKET_SERVER_PYTHON;
  if (!url) {
    throw new Error('SOCKET_SERVER_PYTHON is not set');
  }
  socket = new zmq.Request();
  socket.connect(url);
  inited = true;
}

export async function checkPythonServerAlive(
  timeoutMs = 1000,
): Promise<boolean> {
  initSocket();

  if (!isPythonActive) return false;
  isPythonActive = false;

  try {
    await socket.send(JSON.stringify({ action: 'ping' }));

    const receivePromise = socket
      .receive()
      .then(([buf]) => JSON.parse(buf.toString()) === 'pong');

    const timeoutPromise = new Promise<boolean>((res) =>
      setTimeout(() => res(false), timeoutMs),
    );

    return await Promise.race([receivePromise, timeoutPromise]);
  } finally {
    isPythonActive = true;
  }
}
