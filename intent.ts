import {Handler} from 'alexa-sdk'

export interface Intent {
    handler(alexa: Handler):void
}