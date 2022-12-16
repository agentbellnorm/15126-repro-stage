import { createRouter } from '@backstage/plugin-permission-backend';
import {
  AuthorizeResult,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
} from '@backstage/plugin-permission-node';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { BackstageIdentityResponse } from '@backstage/plugin-auth-node';

class TestPermissionPolicy implements PermissionPolicy {
  n = 0;
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    console.log({ request: JSON.stringify(request), user, n: this.n });
    if (this.n < 20) {
      console.log('Deny!');
      return {
        result: AuthorizeResult.DENY,
      };
    }
    this.n++;

    console.log('Allow!');
    return { result: AuthorizeResult.ALLOW };
  }
}

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    config: env.config,
    logger: env.logger,
    discovery: env.discovery,
    policy: new TestPermissionPolicy(),
    identity: env.identity,
  });
}
