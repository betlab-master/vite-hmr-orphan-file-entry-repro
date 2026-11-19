import './style.css';
// Eager glob so the page still loads while src/probe.js is missing.
import.meta.glob('./src/*.js', { eager: true });
