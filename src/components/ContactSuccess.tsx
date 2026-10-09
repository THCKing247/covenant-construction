export function ContactSuccess({ message }: { message: string }) {
  return (
    <div className="contact-success" role="status">
      <h3>Request received</h3>
      <p>{message}</p>
    </div>
  );
}
