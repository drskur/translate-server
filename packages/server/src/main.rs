mod services;

use actix_web::{App, HttpServer};
use actix_web::middleware::Logger;
use env_logger::{Env};
use lambda_web::{is_running_on_lambda, LambdaError, run_actix_on_lambda};

#[actix_web::main]
async fn main() -> Result<(), LambdaError> {
    env_logger::init_from_env(Env::default().default_filter_or("info"));

    let factory = move || {
        App::new()
            .wrap(Logger::default())
            .service(services::translate::handler)
    };

    if is_running_on_lambda() {
        run_actix_on_lambda(factory).await?;
    } else {
        HttpServer::new(factory)
            .bind("127.0.0.1:8080")?
            .run()
            .await?;
    }

    Ok(())
}