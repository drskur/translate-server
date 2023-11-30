use aws_config::BehaviorVersion;

pub struct AppState {
    pub shared_config: aws_types::SdkConfig,
}

impl AppState {
    pub async fn load_from_env() -> AppState {
        let shared_config = aws_config::load_defaults(BehaviorVersion::latest()).await;
        AppState {
            shared_config
        }
    }
}