import app from '../src/app';
import '../src/mongo';

const port = parseInt(<string> (process.env.PORT || '3201'), 10);

app.listen(port, '0.0.0.0', () => {
  console.log(`[server]: note-service is running at http://localhost:${port}`);
});
