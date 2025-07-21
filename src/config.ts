import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(currentUserName: string) {
  const config: Config = readConfig();
  config.currentUserName = currentUserName;
  writeConfig(config);
}

export function readConfig(): Config {
  const path = getConfigFilePath();
  const data = fs.readFileSync(path, "utf8");
  const rawConfig = JSON.parse(data);
  return validateConfig(rawConfig);
}

function writeConfig(cfg: Config) {
  const path = getConfigFilePath();
  const rawConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };
  const data = JSON.stringify(rawConfig);
  fs.writeFileSync(path, data);
}

function getConfigFilePath(): string {
  const configFile: string = ".gatorconfig.json";
  const fullPath: string = path.join(os.homedir(), ".gatorconfig.json");
  return fullPath;
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url is required in config file");
  }

  const config: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name || "",
  };

  return config;
}
