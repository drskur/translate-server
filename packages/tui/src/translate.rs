use reqwest::{Certificate, Client, Identity};
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct TranslateRequest {
    pub source_language_code: &'static str,
    pub target_language_code: &'static str,
    pub text: String,
}


#[derive(Deserialize)]
pub struct TranslateResponse {
    #[serde(rename = "translatedText")]
    pub text: String,
}

pub struct Translate {
    client: Client,
}

impl Translate {
    pub fn new() -> Self {
        let key = include_bytes!("../key.pem");
        let pem = include_bytes!("../RootCA.crt");
        let client = Client::builder()
            .use_rustls_tls()
            .add_root_certificate(Certificate::from_pem(pem).unwrap())
            .identity(Identity::from_pem(key).unwrap())
            .build()
            .unwrap();

        Translate {
            client,
        }
    }

    pub async fn translate(&self, req: TranslateRequest) -> reqwest::Result<TranslateResponse> {
        let url = "https://api.drskur.xyz/translate/v1/translate";
        let res = self.client.post(url)
            .json(&req)
            .send()
            .await?;

        let json = res.json::<TranslateResponse>().await?;

        Ok(json)
    }
}