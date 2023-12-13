mod services;
mod app_state;

use std::sync::Arc;
use actix_web::{App, HttpServer, web};
use actix_web::middleware::Logger;
use env_logger::{Env};
use crate::app_state::AppState;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(Env::default().default_filter_or("info"));

    let state = Arc::new(AppState::load_from_env().await);

    let factory = move || {
        App::new()
            .app_data(web::Data::new(state.clone()))
            .wrap(Logger::default())
            .service(services::translate::handler)
    };

    HttpServer::new(factory)
        .bind("127.0.0.1:8080")?
        .run()
        .await?;

    Ok(())
}