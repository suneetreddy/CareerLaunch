import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <div className="display-1 fw-bold not-found-num">404</div>
      <h2 className="mb-2">We could not find that page</h2>
      <p className="text-muted mb-4">The link may be broken, or the page may have moved.</p>
      <Link to="/" className="btn btn-indigo rounded-pill px-4 me-2">Go home</Link>
      <Link to="/jobs" className="btn btn-outline-indigo rounded-pill px-4">Find jobs</Link>
    </div>
  );
}
