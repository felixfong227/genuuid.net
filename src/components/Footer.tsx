import ThemeSwitcher from './ThemeSwitcher';

export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-6 sm:px-6">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                    © {new Date().getFullYear()} genuuid.net
                </div>
                <ThemeSwitcher />
            </div>
        </footer>
    );
}
