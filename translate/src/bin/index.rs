use lambda_http::{IntoResponse, Request, service_fn, Error, Response};
use lambda_http::http::header::CONTENT_TYPE;

#[tokio::main]
async fn main() -> Result<(), Error>{
    lambda_http::run(service_fn(handler)).await?;

    Ok(())
}

async fn handler(_request: Request) -> Result<impl IntoResponse, Error> {
    let html = include_str!("index.html");
    let response = Response::builder()
        .header(CONTENT_TYPE, "text/html")
        .body(html)?;

    Ok(response)
}
