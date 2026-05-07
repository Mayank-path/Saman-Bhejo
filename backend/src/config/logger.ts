import winston, { transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const levels = { error: 0, warn: 1, info: 2, http: 3, debug: 4}

// for production we save till warn 
// for development we will save till debug
const currentLevel = (): string => process.env.NODE_ENV === "production" ? "warn" : "debug" 

const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white"
}
winston.addColors(colors)
// how logs look in terminal
const terminalFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
    )
)
// how logs looks in files
const fileformat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss "}),
    winston.format.errors({ stack: true}),
    winston.format.json()
)

const logger = winston.createLogger({
    level: currentLevel(),
    levels,
    transports: [
        new winston.transports.Console({
            format: terminalFormat,
            silent: process.env.NODE_ENV === "test"
        }),
        new DailyRotateFile({
            filename: "logs/combined",
            extension: ".log",
            datePattern: "YYYY-MM-DD",
            format: fileformat,
            maxFiles: "15d",
        }),
        new DailyRotateFile({
            filename: "logs/error",
            extension:".log",
            datePattern: "YYYY-MM-DD",
            level: "error",
            format: fileformat,
            maxFiles: "35d"
        }),
    ]
})

export default logger

