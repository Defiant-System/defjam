<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="session">
	<div class="session">
		<div class="tracks">
			<xsl:call-template name="track">
				<xsl:with-param name="node" select="//Tracks" />
			</xsl:call-template>
			<div class="space"></div>
		</div>

		<div class="io-master">
			<xsl:call-template name="track">
				<xsl:with-param name="node" select="//IoMaster" />
			</xsl:call-template>
		</div>
	</div>
</xsl:template>

<xsl:template name="track">
	<xsl:param name="node" select="."/>
	<xsl:for-each select="$node/*">
		<div class="track">
			<div class="title"><xsl:value-of select="@name"/></div>
			<div class="slots">
				<div class="slot"></div>
				<div class="slot"></div>
				<div class="slot"></div>
				<div class="slot"></div>
				<div class="slot"></div>
				<div class="slot"></div>
				<div class="space"></div>
				<div class="status"></div>
			</div>
			<div class="io"></div>
			<div class="sends">
				<div class="knob" data-value="0" data-label="A"><div></div></div>
				<div class="knob" data-value="0" data-label="B"><div></div></div>
			</div>
			<div class="mixer">
				<div>
					<div class="pan-knob" data-value="0"><div></div></div>
					<div class="toggle-button activator">
						<xsl:value-of select="position()"/>
					</div>
					<div class="toggle-button solo">S</div>
					<div class="toggle-button record">&#9679;</div>
				</div>
				<div class="volume" data-value="88"><div></div></div>
			</div>
		</div>
	</xsl:for-each>
</xsl:template>

</xsl:stylesheet>
