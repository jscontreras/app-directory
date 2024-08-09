import { serverLogger } from '#/otel/logger';
import { ExternalLink } from '#/ui/external-link';
import { BasicLayout } from '#/ui/pages-layout';
import { logs, SeverityNumber } from '@opentelemetry/api-logs';

// service name
const serviceName = process.env.NEW_RELIC_APP_NAME || '';

export default function HeadersPage({ headers }: { headers: Object }) {
  return (
    <BasicLayout>
      return (
      <div className="prose prose-sm prose-invert max-w-none">
        <h1 className="text-xl font-bold">Headers</h1>

        <ul>
          <li>Fetch Headers</li>
        </ul>
        <div className="mb-8 grid grid-cols-3 gap-x-6 gap-y-3">
          <div className="col-span-full space-y-3 lg:col-span-4">
            <h1 className="truncate text-2xl font-medium capitalize text-gray-200">
              JSON Headers (Overriden)
            </h1>
            <pre>{JSON.stringify(headers, null, 2)}</pre>
          </div>
        </div>

        <div className="flex gap-2">
          <ExternalLink href="https://nextjs.org/docs/app/api-reference/functions/fetch">
            Docs
          </ExternalLink>
          <ExternalLink href="https://github.com/jscontreras/app-directory/blob/main/pages/pages/headers/overridden/index.tsx">
            Code
          </ExternalLink>
        </div>
      </div>
    </BasicLayout>
  );
}

export async function getServerSideProps({ req }: { req: Request }) {
  const logger = logs.getLogger(serviceName);
  // Emmitting Log with Open Telemetry Custom Provisioning (not working)
  logger.emit({
    body: `[${process.env.TELEMETRY_CUSTOM_PRODUCER}]** (OpenTelemetry) Testing Log Emiter for rewrite to echo.free.beeceptor.com`,
    severityNumber: SeverityNumber.INFO,
    attributes: {
      key: 'value',
    },
  });

  // Emitting Log with winston to NewRelic Directly
  serverLogger.log(
    'info',
    `[${process.env.TELEMETRY_CUSTOM_PRODUCER}]** (winston) Testing Log Emiter for rewrite to echo.free.beeceptor.com`,
    { key: 'value' },
  );
  // JSON request
  const headers = {
    'X-Forwarded-Host': 'overriden-host.com',
    'x-forwarded-custom-host': 'overriden-host.com',
  };
  const reqHeaders: any = req.headers;
  const host = reqHeaders.host;
  const protocol = reqHeaders['x-forwarded-proto'] || 'http';
  const url = `${protocol}://${host}/proxy-via-middleware`;
  const echoHeaders = await fetch(url, {
    headers: new Headers(headers),
  });

  const response: any = await echoHeaders.json();
  return {
    props: {
      headers: response,
      cache: 'no-store',
    },
  };
}
