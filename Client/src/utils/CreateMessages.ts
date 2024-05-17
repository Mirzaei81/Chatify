import { genLorem } from "./randomText"
import { IMessage } from "types/util";

export const createMessages = (x: number) => {
	const RandomWords = genLorem(x)
	const messages: IMessage[] = []
	RandomWords.forEach((word) => {
		const Msg: IMessage = { author: (Math.random() > 0.5 ? "amirarshia mirzaei" : "user"), message_body: word, url: "", created_at: Date.now().toString() }
		messages.push(Msg)
	})
	return messages
}
