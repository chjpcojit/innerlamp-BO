export type Theme = 'light' | 'dark';

const KEY = 'innerlamp-bo.theme';

// Initial class is set by the inline script in app.html (avoids a flash); this keeps state in sync.
class ThemeState {
	current = $state<Theme>('light');

	init() {
		this.current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
	}

	set(theme: Theme) {
		this.current = theme;
		document.documentElement.classList.toggle('dark', theme === 'dark');
		try {
			localStorage.setItem(KEY, theme);
		} catch {
			// storage unavailable; theme applies for this page view only
		}
	}

	toggle() {
		this.set(this.current === 'dark' ? 'light' : 'dark');
	}
}

export const theme = new ThemeState();
