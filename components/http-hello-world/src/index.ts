import {
  IncomingRequest,
  ResponseOutparam,
  OutgoingBody,
  OutgoingResponse,
  Fields
} from "wasi:http/types@0.2.0";
// @ts-ignore
import { calculatesum } from "wasmcloud:hello/calculator";
// import regular node_modules dependency
import { cowsay } from 'cowsayjs';

function handle(req: IncomingRequest, resp: ResponseOutparam) {
  // Start building an outgoing response
  const outgoingResponse = new OutgoingResponse(new Fields());

  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  const result = calculatesum(num1, num2);

  // use the cowsay library to create a message
  const message = cowsay({ message: `Hello from Typescript!\nThe result of ${num1} + ${num2} is ${result}!`})

  // Access the outgoing response body
  let outgoingBody = outgoingResponse.body();
  {
    // Create a stream for the response body
    let outputStream = outgoingBody.write();
    // Write hello world to the response stream
    outputStream.blockingWriteAndFlush(
      new Uint8Array(new TextEncoder().encode(message))
    );
    // @ts-ignore: This is required in order to dispose the stream before we return
    outputStream[Symbol.dispose]();
  }

  // Set the status code for the response
  outgoingResponse.setStatusCode(200);
  // Finish the response body
  OutgoingBody.finish(outgoingBody, undefined);
  // Set the created response
  ResponseOutparam.set(resp, { tag: "ok", val: outgoingResponse });
}

export const incomingHandler = {
  handle,
};

