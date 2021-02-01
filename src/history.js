import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

history.listen((_) => {
    // Scroll back to the top
    window.scrollTo(0, 0);
});

export default history;
