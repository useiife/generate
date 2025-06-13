import { build } from "../utils/build"
export default defineEventHandler(async (event) => {
    const {config, code} = await readBody(event)
    return await build(config, code)
})