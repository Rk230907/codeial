const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial-development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: 'development.ypatel@gmail.com',
            pass: 'itzlpiwlwnvaybvv'
        }
    },
    google_client_ID: "187270952782-m7ool49ckt2nqjo3v9aabpta068il6d6.apps.googleusercontent.com",
    google_client_Secret: "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",
    google_call_back_URL: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'codeial'
}

const production = {
    name: 'production',
    asset_path: './public/assets',
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: process.env.CODEIAL_GOOGLE_USERNAME,
            pass: process.env.CODEIAL_GOOGLE_PASSWORD
        }
    },
    google_client_ID: process.env.GOOGLE_CLIENT_ID,
    google_client_Secret: process.env.GOOGLE_CLIENT_SECRET,
    google_call_back_URL: process.env.GOOGLE_CALL_BACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET
    
}

module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development: eval(process.env.CODEIAL_ENVIRONMENT);   