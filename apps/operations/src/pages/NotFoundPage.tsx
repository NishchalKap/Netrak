import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
export function NotFoundPage() { return <div className="not-found"><span>404</span><h1>This operational view does not exist.</h1><p>The address may be incomplete, or the resource has moved.</p><Link className="button button--primary" to="/"><ArrowLeft size={17} /> Return to overview</Link></div>; }
