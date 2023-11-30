import FooterPresenter from './presenter/footer-presenter';
import HeaderPresenter from './presenter/header-presenter';
import MainPresenter from './presenter/main-presenter';

const mainContainer = document.querySelector('.main');
const headerContainer = document.querySelector('.header');
const footerContainer = document.querySelector('.footer__statistics');

const navigation = new HeaderPresenter(headerContainer);
const presenter = new MainPresenter(mainContainer);
const footer = new FooterPresenter(footerContainer);

navigation.init();
presenter.init();
footer.init();

