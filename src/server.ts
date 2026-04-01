import { app } from "./app";
import { logger } from "./utils/logger";

const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});
