use lambda_http::{IntoResponse, Request, service_fn, Error};
use serde::{Deserialize};
use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), Error>{
    lambda_http::run(service_fn(handler)).await?;

    Ok(())
}

#[derive(Debug, Deserialize)]
struct RequestBody {
    pub text: String
}

async fn handler(request: Request) -> Result<impl IntoResponse, Error> {
    let shared_config = aws_config::load_from_env().await;
    let client = aws_sdk_translate::Client::new(&shared_config);

    let body = serde_json::from_slice::<RequestBody>(request.body())?;
    let mut lines = vec![];

    for line in body.text.split("\n") {
        if line.trim().is_empty() {
            continue;
        }

        let translate = client.translate_text()
            .source_language_code("en")
            .target_language_code("ko")
            .text(line)
            .send()
            .await?;

        lines.push(line.to_string());
        lines.push(translate.translated_text.unwrap_or("".to_string()));
        lines.push("".to_string());
    }

    let result = lines.join("\n");

    Ok(json! {{
        "translatedText": result
    }})
}
