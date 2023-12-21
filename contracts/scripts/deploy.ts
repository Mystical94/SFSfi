import { main } from './deployAll';

main(true).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
