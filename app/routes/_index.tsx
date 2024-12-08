import { useState } from "react";
import { Form, useRevalidator } from "react-router";
import { Input } from "~/components/input";
import { getPublic } from "~/utils/.client/public";
import { getCommon } from "~/utils/.common/common";
import { getSecret } from "~/utils/.server/secret";
import { getEnv } from "~/utils/env.server";
import type { Route } from "./+types/_index";
import dbLogo from "/images/database.svg";

export function loader() {
  console.log(getSecret(), getCommon());
  return {
    env: getEnv(),
  };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  console.log(getPublic(), getCommon());
  return {
    ...(await serverLoader()),
  };
}

clientLoader.hydrate = true;

async function doSomethingThatTakesALongTime() {
  return new Promise((resolve) =>
    setTimeout(() => resolve("result"), 20000)
  ) as Promise<string>;
}

export async function action() {
  return {
    result: await doSomethingThatTakesALongTime(),
  };
}

export default function Index({ loaderData: data }: Route.ComponentProps) {
  const [value, setValue] = useState("");
  console.log("dbLogo", dbLogo);
  console.log("value", value);
  const { revalidate } = useRevalidator();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Form method="POST">
        <button
          type="submit"
          formMethod="POST"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Execute action
        </button>
      </Form>

      <button
        type="button"
        onClick={revalidate}
        className="flex items-center gap-2"
      >
        <img src={dbLogo} alt="Database" />
        Revalidate
      </button>
      <input />
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <div className="mt-8 w-full max-w-4xl overflow-x-auto">
        <table className="w-full border-collapse bg-gray-100 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Key
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(data.env).map(([key, value]) => (
              <tr key={key} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {key}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {value ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
