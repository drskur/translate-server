mod translate;

use std::io;
use crossterm::event::{DisableMouseCapture, EnableMouseCapture};
use crossterm::terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen};
use ratatui::backend::CrosstermBackend;
use ratatui::layout::{Constraint, Layout};
use ratatui::prelude::Direction;
use ratatui::style::{Color, Modifier, Style};
use ratatui::Terminal;
use ratatui::widgets::{Block, Borders};
use tui_textarea::{Input, Key, TextArea};
use crate::translate::{Translate, TranslateRequest};

fn inactivate(textarea: &mut TextArea<'_>, id: usize) {
    let titles = ["English", "한국어"];

    textarea.set_cursor_line_style(Style::default());
    textarea.set_cursor_style(Style::default());
    textarea.set_block(
        Block::default()
            .borders(Borders::ALL)
            .style(Style::default().fg(Color::DarkGray))
            .title(format!(" {} ", titles[id])),
    );
}

fn activate(textarea: &mut TextArea<'_>, id: usize) {
    let titles = ["English", "한국어"];

    textarea.set_cursor_line_style(Style::default().add_modifier(Modifier::UNDERLINED));
    textarea.set_cursor_style(Style::default().add_modifier(Modifier::REVERSED));
    textarea.set_block(
        Block::default()
            .borders(Borders::ALL)
            .style(Style::default())
            .title(format!(" {} (^T to translate, ^X to switch)", titles[id])),
    );
}

#[tokio::main]
async fn main() -> io::Result<()> {
    let stdout = io::stdout();
    let mut stdout = stdout.lock();
    enable_raw_mode()?;
    crossterm::execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
    let backend = CrosstermBackend::new(stdout);
    let mut term = Terminal::new(backend)?;

    let mut textarea = [TextArea::default(), TextArea::default()];

    let layout = Layout::default()
        .direction(Direction::Horizontal)
        .constraints([Constraint::Percentage(50), Constraint::Percentage(50)].as_ref());

    let mut which = 0;
    activate(&mut textarea[0], 0);
    inactivate(&mut textarea[1], 1);

    let translate = Translate::new();

    loop {
        term.draw(|f| {
            let chucks = layout.split(f.size());
            for (textarea, chunk) in textarea.iter().zip(chucks.iter()) {
                let widget = textarea.widget();
                f.render_widget(widget, *chunk);
            }
        })?;
        match crossterm::event::read()?.into() {
            Input { key: Key::Esc, .. } => break,
            Input {
                key: Key::Char('t'),
                ctrl: true,
                ..
            } => {
                let origin_area = &textarea[which];
                let text = origin_area.lines().join("\n");

                let req = TranslateRequest {
                    text,
                    source_language_code: if which == 0 { "en" } else { "ko" },
                    target_language_code: if which == 0 { "ko" } else { "en" },
                };
                let res = translate.translate(req).await.unwrap();

                let translate_lines = res.text.split('\n').map(|s| s.to_string()).collect::<Vec<_>>();
                let temp_which = (which + 1) % 2;
                let mut target_area = TextArea::new(translate_lines);
                inactivate(&mut target_area, temp_which);
                textarea[temp_which] = target_area;
            },
            Input {
                key: Key::Char('x'),
                ctrl: true,
                ..
            } => {
                inactivate(&mut textarea[which], which);
                which = (which + 1) % 2;
                activate(&mut textarea[which], which);
            }
            input => {
                textarea[which].input(input);
            }
        }
    }

    disable_raw_mode()?;
    crossterm::execute!(
        term.backend_mut(),
        LeaveAlternateScreen,
        DisableMouseCapture
    )?;
    term.show_cursor()?;

    Ok(())
}
